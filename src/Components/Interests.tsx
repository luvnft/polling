import { useState } from "react";
import { EventTemplate, Event, getEventHash, SimplePool } from "nostr-tools";
import { Metadata, RELAYS } from "../App";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

export default function Interests() {

	const navigate = useNavigate();

	const handlePageClick = (interest: string) => {
		navigate(`/boardroom/${interest}`)
	};
	
	const interestList: string[] = [
		"Animals", 
		"Art",  
		"Electronics", 
		"Finance",
		"Politics",
		"Travel"]

	return (
		<div className="flex flex-col justify-center items-center">
			<Header />
			<div className="grid grid-cols-3 grid-flow-row gap-4 justify-center items-center justify-items-center w-2/3">
				{interestList.map((interest) => (
						<button 
							className="text-white text-center font-medium relative rounded-xl h-full w-full hover:opacity-60"
							onClick={() => handlePageClick(interest)} 
						>
							<h1 className="absolute inset-0 flex items-center justify-center text-center lg:text-4xl md:text-xl sm: text-m">
								{interest}
							</h1>
							<img
								className="object-cover h-full w-full rounded-xl"
								src={`/${interest}.png`}
								alt=""
							/>
						</button>
				))}
			</div>
		</div>
	);

}

// <div className="bg-blue-500 h-screen">
// 	<div className="bg-white p-6 rounded-xl">
// 		interest page
// 	</div>
// 	<div className="bg-white rounded-xl p-5 gap-4 flex-col flex">
// 		<div className="flex gap-3 justify-center h-48 w-full">
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md font-medium">
// 				Int1
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int2
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int3
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int4
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int5
// 			</button>
// 		</div>
// 		<div>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white center h-full rounded-md font-medium">
// 				Int1
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int2
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int3
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int4
// 			</button>
// 			<button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
// 				Int5
// 			</button>

// 		</div>
// 	</div>
// </div>