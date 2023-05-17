import { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Modal from 'react-modal';
import tw from 'tailwind-styled-components';
import { SimplePool } from 'nostr-tools';

// components import
import ReplyPoll from '../ReplyPoll';

// Styling for the comment button
const CommentButton = tw.button`
  text-white hover:text-black py-2 px-4 rounded
`;

// Styling for the modal window
const customStyles = {
   content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
   },
};

interface Props {
   event: {
      id: string;
      pubkey: string;
   };
   pool: SimplePool;
   content: string;
   user: {
      image: string;
      name: string;
      date: string;
   }
}

export default function CommentModal({ event, pool, content, user }: Props) {
   const [modalIsOpen, setModalIsOpen] = useState(false);

   return (
      <>
         <CommentButton onClick={() => {
            setModalIsOpen(true);
         }}>
            <FaComment />
         </CommentButton>
         <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
            <div className="flex justify-between mb-4">
               <img src={user.image} alt="User Avatar" className="h-8 w-8 rounded-full" />
               <h2 className="text-lg font-bold">{user.name} created poll:</h2>
               <button className="text-gray-600" onClick={() => setModalIsOpen(false)}><AiOutlineCloseCircle/></button>
            </div>
            <p className="text-gray-800 mb-4">{content}</p>
            <ReplyPoll event={event} pool={pool} toggleMenu={setModalIsOpen} rows={6}/>
         </Modal>
      </>
   );
};

