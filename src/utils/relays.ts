// define relays
const RELAYS = [
   "wss://nostr.pub.wellorder.net",
   "wss://nostr.drss.io",
   "wss://nostr.swiss.enigma.ch",
   "wss://relay.damus.io",
 ];

 export class Relays {
   static relays = RELAYS;

   // returns the list of relays
   static getRelays() {
      return this.relays;
    }
  
    // adds a relay to the list
    static addRelay(relay: string) {
      this.relays.push(relay);
    }
  
    // removes a relay from the list
    static removeRelay(relay: string) {
      this.relays = this.relays.filter((r) => r !== relay);
    }
  
    // resets the relays to the relay parameter
    static setRelays(relays: string[]) {
      this.relays = relays;
    }
 }