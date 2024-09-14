import { useRecoilState } from "recoil"
import { loadingState } from "../atoms/appAtom"


export const useLoading = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingState);
  
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);
  
    return { isLoading, showLoading, hideLoading };
}