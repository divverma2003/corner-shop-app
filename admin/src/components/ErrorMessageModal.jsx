import { CircleX } from "lucide-react";

const ErrorMessageModal = ({ message }) => {
  return (
    <div>
      <dialog id="error-msg-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Error</h3>
          <p className="py-4">{message}</p>
          <CircleX className="mt-5 size-10 text-red-800" />
        </div>
      </dialog>
    </div>
  );
};

export default ErrorMessageModal;
