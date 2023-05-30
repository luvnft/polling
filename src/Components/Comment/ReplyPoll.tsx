import { getEventHash, SimplePool, Event, getPublicKey, UnsignedEvent, signEvent } from "nostr-tools";
import { useState } from "react";
import { RELAYS } from "../../App";
import CryptoJS from 'crypto-js';

// the reply takes in an event in order to reply to it
interface Props {
   encryptedPrivkey: string;
   pool: SimplePool;
   event: {
      id: string;
      pubkey: string;
   };
   toggleMenu: (show: boolean) => void;
   rows: number;
}

export default function ReplyPoll({ encryptedPrivkey, event, pool, toggleMenu, rows }: Props) {

   const [pollReply, setPollReply] = useState("");

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // if (!window.nostr) {
      //    alert("Nostr extension not found");
      //    return;
      // }
      const _baseEvent = {
         kind: 1,
         created_at: Math.round(Date.now() / 1000),
         tags: [
            [
               "e",
               event.id,
               "",
               "root"
            ],
            [
               "p",
               event.pubkey,
            ]
         ],
         content: pollReply,
         pubkey: getPublicKey(JSON.parse(CryptoJS.AES.decrypt(encryptedPrivkey, 'AITCSunrise').toString(CryptoJS.enc.Utf8))),
      } as UnsignedEvent;

      try {

         //const pubkey = await window.nostr.getPublicKey();
         //const sig = (await window.nostr.signEvent(_baseEvent)).sig;

         const event: Event = {
            ..._baseEvent,
            sig: signEvent(_baseEvent, JSON.parse(CryptoJS.AES.decrypt(encryptedPrivkey, 'AITCSunrise').toString(CryptoJS.enc.Utf8))),
            id: getEventHash(_baseEvent),
         } as Event;

         const pubs = pool.publish(RELAYS, event);

         let clearedInput = false;

         pubs.on("ok", () => {
            if (clearedInput) return;

            clearedInput = true;
            setPollReply("");
         });

      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
      toggleMenu(false);
   }

   return (
      <div>
         <form className="flex flex-row justify-start" onSubmit={onSubmit}>
            <div className="w-full">
               <textarea
                  placeholder="Write your note here..."
                  className="border border-gray-300 bg-[#F4F7FA] rounded-lg w-full p-2"
                  value={pollReply}
                  onChange={(e) => setPollReply(e.target.value)}
                  rows={rows} />
            </div>
            <div>
               <button className="border border-[#276749] bg-[#5DAE86] hover:bg-[#2F855A] text-white p-2 rounded-lg">
                  Reply
               </button>
            </div>
         </form>
      </div>
   )
}

// #3570D4, #163C65, #895AD5, #6768E6, #DC55DC, #2B2E58, #88AAF5, #8DC2FD, #7DFBFB, #35227A
