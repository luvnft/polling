import { SimplePool, Event, getEventHash, EventTemplate } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { RELAYS } from "../../App"
import Slider from './PollSlider'

interface Props {
   event: {
      id: string;
      pubkey: string;
   }
   pool: SimplePool;
}
export default function MajorityPoll({ event, pool }: Props) {
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

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }

      const _baseEvent = {
         content: `${votePercentage}, ${voteCount}, ${sum}`,
         created_at: Math.round(Date.now() / 1000),
         kind: 30078,
         tags: [["d", event.id]],
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
         kinds: [30078],
         limit: 100,
         "#d": [event.id],
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
      <div className="w-1/2 text-white">
         <form onSubmit={onSubmit}>
            {!voted ? (
               <div className='flex flex-row gap-1 '>
                  <button
                     type="submit"
                     className="px-4 py-2 text-sm font-small text-white border-[#276749] bg-[#5DAE86] hover:bg-[#2F855A] rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                     onClick={(() => {
                        setVoteCount(voteCount + 1)
                        setSum(sum + value)
                     })}
                  >
                     Vote
                  </button>
                  <Slider defaultValue={value} setValue={setValue} disabled={false}/>
               </div>) : (
               <div>
                  <h1 className='text-xs font-medium text-white'>You voted {value}%</h1>
                  <h1 className='text-xs font-medium text-white'>People {votePercentage}% agree with this information</h1>
                  <Slider defaultValue={votePercentage} setValue={setValue} disabled={true}/>
               </div>
            )
            }
         </form>
      </div>
   );
}
