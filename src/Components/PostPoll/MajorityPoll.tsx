import React, { useEffect, useState } from 'react'
import { SimplePool, Event, getEventHash, EventTemplate, getPublicKey, UnsignedEvent, signEvent } from 'nostr-tools';
import { FaVoteYea } from 'react-icons/fa'
import { RELAYS } from "../../App"
import Slider from './PollSlider'
import CryptoJS from 'crypto-js';

interface Props {
   encryptedPrivkey: string;
   event: Event;
   pool: SimplePool;
}

export default function MajorityPoll({ encryptedPrivkey, event, pool }: Props) {
   const [voteCount, setVoteCount] = useState(0);
   const [value, setValue] = useState(20);
   const [sum, setSum] = useState(0);
   const [curVoteResult, setCurVoteResult] = useState(0);
   const [voted, setVoted] = useState(false);
   const [votePercentage, setVotePercentage] = useState(0);

   useEffect(() => {
      const number = (sum / voteCount);
      setVotePercentage(parseFloat(number.toFixed(2)));
   }, [voteCount, sum])


   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const tags: string[][] = event.tags.filter((tag: string[]) => {
         return tag.length >= 2 && (tag[0] === "e" || tag[0] === "p");
      });

      tags.push(["e", event.id])
      tags.push(["p", event.pubkey])

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }

      const _baseEvent = {
         kind: 7,
         created_at: Math.round(Date.now() / 1000),
         tags: tags,
         content: `${votePercentage}, ${voteCount}, ${sum}`,
         pubkey: getPublicKey(JSON.parse(CryptoJS.AES.decrypt(encryptedPrivkey, 'AITCSunrise').toString(CryptoJS.enc.Utf8))),
      } as UnsignedEvent;

      try {

         //const pubkey = await window.nostr.getPublicKey();
         //const sig = (await window.nostr.signEvent(_baseEvent)).sig;

         const event: Event = {
            ..._baseEvent,
            sig: signEvent(_baseEvent, JSON.parse(CryptoJS.AES.decrypt(encryptedPrivkey, 'AITCSunrise').toString(CryptoJS.enc.Utf8))),
            id: getEventHash(_baseEvent),
            //id: getEventHash({ ..._baseEvent, pubkey }),
         };

         const pubs = pool.publish(RELAYS, event);

         let clearedInput = false;


         pubs.on("ok", () => {
            if (clearedInput) return;
            clearedInput = true;
         });

         setVoted(true);
      } catch (error) {
         alert("User rejected operation");
      }
   }

   // when component is mounted
   useEffect(() => {
      if (!pool) return;
      // subscribe to the events that have the d tag as the event sig
      const sub = pool.sub(RELAYS, [{
         kinds: [7],
         limit: 100,
         "#e": [event.id],
      }]);

      // on subscrition set the results
      sub.on("event", (event: Event) => {
         const pollValues = event.content.split(",").map(Number);
         setCurVoteResult(pollValues[0]);
         setVoteCount(pollValues[1]);
         setSum(pollValues[2] ? pollValues[2] : 0);
      })

      return () => {
         sub.unsub();
      }

   }, [])


   return (
      <form onSubmit={onSubmit} className=''>
         {!voted ? (
            <div className='flex flex-row items-center gap-5'>
               <button type="submit">
                  <FaVoteYea className="text-[#5DAE86] hover:text-[#2F855A] mb-7 cursor-copy" onClick={(() => {
                     setVoteCount(voteCount + 1)
                     setSum(sum + value)
                  })} />
               </button>
               <Slider defaultValue={value} setValue={setValue} disabled={false} />
            </div>) : (
            <div className='flex items-center gap-5'>
               <h1 className='text-xs font-medium text-black'>You voted {value}%</h1>
               <h1 className='text-xs font-medium text-black'>People {votePercentage}% agree with this information</h1>
               <Slider defaultValue={votePercentage} setValue={setValue} disabled={true} />
            </div>
         )
         }
      </form>
   );
}
