import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

const Loader = () => {
  const isLoading = useSelector(state => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <ClipLoader color="#734aef" loading={true} size={80} />
    </div>
  );
};

export default Loader;
