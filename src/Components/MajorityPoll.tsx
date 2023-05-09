import { SimplePool, Event, getEventHash, EventTemplate } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { RELAYS } from "../App"
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';


interface Props {
   event: {
      id: string;
      pubkey: string;
   }
   pool: SimplePool;
}
export default function MajorityPoll({ event, pool }: Props) {

   const [results, setResults] = useState([]);
   const [agreeCount, setAgreeCount] = useState(0);
   const [disagreeCount, setDisagreeCount] = useState(0);

   const totalVotes = agreeCount + disagreeCount;
   const agreePercent = totalVotes === 0 ? 0 : Math.round((agreeCount / totalVotes) * 100);
   const disagreePercent = totalVotes === 0 ? 0 : Math.round((disagreeCount / totalVotes) * 100);


   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }

      const _baseEvent = {
         content: `${agreeCount},${disagreeCount}`,
         created_at: Math.round(Date.now() / 1000),
         kind: 30078,
         tags: [["d", event.id]]
      } as EventTemplate;

      try {

         const pubkey = await window.nostr.getPublicKey();

         const sig = (await window.nostr.signEvent(_baseEvent)).sig;

         const event: Event = {
            ..._baseEvent,
            sig,
            pubkey,
            id: getEventHash({ ..._baseEvent, pubkey }),
         };

         const pubs = pool.publish(RELAYS, event);

         let clearedInput = false;

         console.log("published event", event);

         pubs.on("ok", () => {
            if (clearedInput) return;
            clearedInput = true;
         });

      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
   }

   // when component is mounted
   useEffect(() => {
      if (!pool) return;
      // subscribe to the events that have the d tag as the event sig
      const sub = pool.sub(RELAYS, [{
         kinds: [30078],
         limit: 100,
         "#d": [event.id],
      }]);

      // on subscrition set the results
      sub.on("event", (event: Event) => {
         console.log("MajorityPoll -> event", event)
         const pollValues = event.content.split(",").map(Number);
         setAgreeCount(pollValues[0]);
         setDisagreeCount(pollValues[1]);
         console.log("MajorityPoll -> pollValues", pollValues)
      })

      return () => {
         sub.unsub();
      }

   }, [])

   const setTags = (tag: [], agree: Boolean) => {
   }

   return (
      <div className="w-72 bg-white rounded-lg shadow-md">
         <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900">Do you agree?</h2>
            <div className="flex justify-between items-center mt-4">
               <div className="flex-1 mr-4">
                  <div className="flex items-center">
                     <div className="bg-green-500 h-2 w-1/2 rounded-full mr-2"></div>
                     <span>{agreePercent}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Agree</p>
               </div>
               <div className="flex-1">
                  <div className="flex items-center">
                     <div className="bg-red-500 h-2 w-1/2 rounded-full mr-2"></div>
                     <span>{disagreePercent}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Disagree</p>
               </div>
            </div>
         </div>
         <div className="bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${agreePercent}%` }}></div>
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${disagreePercent}%` }}></div>
         </div>
         <div className="flex justify-between items-center px-4 py-2">
            <form onSubmit={onSubmit}>
               <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => setAgreeCount((prevCount) => prevCount + 1)}
               >
                  Agree
               </button>
               <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => setDisagreeCount((prevCount) => prevCount + 1)}
               >
                  Disagree
               </button>
            </form>
         </div>
      </div>
   );
}
