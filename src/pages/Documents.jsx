import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/loader/loaderSlice';

const Documents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader());
      await new Promise(res => setTimeout(res, 2000));
      dispatch(hideLoader());
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">📄 Documents</h1>
    </div>
  );
};

export default Documents;
