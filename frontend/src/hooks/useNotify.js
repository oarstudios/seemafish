import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useNotify = () => {
  const notify = (message, type) => {
    const config = {
      theme: "light",
      className: `toast-custom`, // Use type here for styling
      autoClose: 1000, // You can adjust the autoClose time as needed
      pauseOnHover: true, // Allows pausing the toast when hovered
      closeButton: true, // Adds a close button for the toast
    };

    if (type === "success") {
      toast.success(message, config);
    } else if (type === "error") {
      toast.error(message, config);
    }
  };

  return { notify };
};

export default useNotify;
