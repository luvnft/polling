import { SimplePool } from "nostr-tools";
import {
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { Relays } from "./relays";

interface State {
   relayPool: SimplePool | null;
}

// create a context for the relay pool to be used in other components
const RelayPoolContext = createContext<State | null>(null);

export default function RelayPoolProvider({ children }: any) {
   const [relayPool, setRelayPool] = useState<SimplePool | null>(null);


   // create a relay pool once and store it in a state so we can use it in other components
   useEffect(() => {
      const _pool = new SimplePool();
      setRelayPool(_pool);

      return () => {
         _pool.close(Relays.getRelays());
      };
   }, []);

   return (
      <RelayPoolContext.Provider
         value={{
            relayPool,
         }}
      >
         {children}
      </RelayPoolContext.Provider>
   );
};

// create a custom hook to use the relay pool
export const useRelayPool = () => {
   const result = useContext(RelayPoolContext);

   if (!result) throw new Error("No Relay Pool Provider was found");

   return result;
};