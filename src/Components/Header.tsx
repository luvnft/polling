export default function Header() {
   return (
      <header className="bg-white">
         <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
               <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">LUV NFT VOTE</span>
                  <img className="w-28 h-auto" src="/AITCMain2.png" alt="" />
               </a>
            </div>
            <div className="flex lg:hidden">
               <div className="inline-flex items-center justify-center p-2.5">
                  <img className="w-24 h-auto" src="/AITCSmall.png" alt="" />
               </div>
            </div>
            <div className="relative hidden lg:flex lg:gap-x-12">
               <div className="p-4 flex flex-col items-center">
                  <img className="w-60 h-auto" src="/AITCWords.png" alt="" />
               </div>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
               <a href="https://vote.luvnft.com" className="text-sm font-semibold leading-6 text-gray-900">Placeholder Link</a>
            </div>
         </nav>
      </header>
   );
}

