import { ClipLoader } from 'react-spinners';

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <ClipLoader color="#734aef" size={70} />
    </div>
  );
};
