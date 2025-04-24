import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

const Loader = () => {
  const isLoading = useSelector(state => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <ClipLoader color="#734aef" size={70} />
    </div>
  );
};

export default Loader;
