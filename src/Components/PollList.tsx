import { Event, SimplePool, nip19 } from "nostr-tools";
import PollCard from "./PollCard";
import { Metadata } from "../types/nostr";

interface Props {
   pool: SimplePool;
   events: Event[];
   metadata: Record<string, Metadata>;
}

export default function Poll({ events, metadata, pool }: Props) {
   return (
      <div className="flex flex-col w-1/2 gap-10">
         {
            events.map((event) => (
               <PollCard
                  event={event}
                  pool={pool}
                  key={event.id}
                  content={event.content}
                  user={{
                     name: metadata[event.pubkey]?.name || nip19.npubEncode(event.pubkey),
                     image: metadata[event.pubkey]?.picture ||
                        `https://api.dicebear.com/5.x/identicon/svg?seed=${event.pubkey}`,
                     pubkey: event.pubkey,
                  }}
                  created_at={event.created_at}
                  hashtags={event
                     .tags
                     .filter((t) => t[0] === 't')
                     .map(t => t[1])}
               />

            ))
         }
      </div>
   )
}