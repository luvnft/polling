import { Event, SimplePool, nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react'
import { RELAYS } from '../App';
import { getProfileDataFromMetaData, insertEventIntoDescendingList } from '../utils/helperFunctions';
import { useMetadata } from '../utils/use-metadata';


interface Props {
   pool: SimplePool;
   event: {
      id: string;
      pubkey: string;
   };

}

export default function CommentSection({ pool, event }: Props) {
   const [events, setPollReply] = useState<Event[]>([]);
   const [pubkeys, setPubKeys] = useState<string[]>([]);
   let { metadata } = useMetadata({ pubkeys });

   // query tags with the same id in their e tag and pub key in their p tag
   useEffect(() => {

      if (!pool) return;

      const sub = pool.sub(RELAYS, [{
         kinds: [1],
         limit: 100,
         "#e": [event.id],
         "#p": [event.pubkey]
      }])

      sub.on("event", (event: Event) => {
         setPollReply((events) => insertEventIntoDescendingList(events, event));
         setPubKeys([...pubkeys, event.pubkey]);
      })

      return () => {
         // close the subscription when we unmount the component
         sub.unsub();
      }

   }, [])


   return (
      <div className='w-full'>
         <h1 className="text-white">Comments</h1>
         <div className='h-64 w-full p-4 overflow-y-scroll'>
            {
               events.map((evnt) => (
                  // make key unique other than Math.random()
                  <div key={Math.random()} className="flex flex-col p-2">
                     <div className="user-info flex items-center">
                        <img src={getProfileDataFromMetaData(metadata, evnt.pubkey).image ||
                           `https://api.dicebear.com/5.x/identicon/svg?seed=${evnt.pubkey}`} alt="User Avatar" className="h-8 w-8 rounded-full" />
                        <a
                           href={`https://nostr.guru/p/${evnt.pubkey}`}
                           className="text-body3 text-white overflow-hidden text-ellipsis"
                           target="_blank"
                           rel="noreferrer"
                        >
                           <p className="ml-2 font-semibold text-gray-700 text-sm">{getProfileDataFromMetaData(metadata, evnt.pubkey).name || nip19.npubEncode(evnt.pubkey)}</p>
                        </a>
                     </div>
                     <p>{evnt.content}</p>
                  </div>
               ))
            }
         </div>
      </div>
   )
}

