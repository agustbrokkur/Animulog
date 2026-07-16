import { useQuery } from '@tanstack/react-query';
import { getAnimu } from '../services/animuService';

export const useAnimu = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAnimu,
    });
}