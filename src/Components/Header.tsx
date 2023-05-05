export default function Header() {

   return (
      <header className="bg-white">
         <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
               <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">AITC Polling</span>
                  <img className="w-24 h-auto" src="/aitc-logo.png" alt="" />
               </a>
            </div>
            <div className="flex lg:hidden">
               <div className="inline-flex items-center justify-center p-2.5">
                  <h1 className="text-xl font-bold text-gray-900">AITC Polling</h1>
               </div>
            </div>
            <div className="relative hidden lg:flex lg:gap-x-12">
               <div className="p-4 flex flex-col items-center">
                  <h1 className="text-3xl font-bold text-gray-900">AITC Polling</h1>
                  <p className="text-gray-600">A decentralized social media platform</p>
               </div>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
               <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
               </a>
            </div>
         </nav>
      </header>
   )
}
