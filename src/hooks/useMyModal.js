import { useRecoilState } from "recoil";
import modalAtom from "../atoms/modalAtom";

const useMyModal = () => {
  const [modal, setModal] = useRecoilState(modalAtom);

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
      setModal({ isOpen: false, type: null });
  };
  const submitEd = () => {
    setModal({ isOpen: false, type: null, data: null });
  }

  const updateModalData = (newData) => {
    setModal(prev => ({ ...prev, data: { ...prev.data, ...newData } }));
  };

  return { modal, openModal, closeModal, updateModalData, submitEd };
};
export default useMyModal;
