import { Data } from "@/utils/Interfaces";
import { toast } from "sonner";
import { POST } from "./rate-limit-token.manager";

interface APIResponse {
    message:string;
    error:string;
    data:Data
}

class ApiRequest {
    constructor() { }


    public post = async (data: Data, route: string, setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>, method?: "PATCH") => {
        const apiPromise = async () => {
            try {
                setIsDisabled && setIsDisabled(true);
                const result:APIResponse = await POST(data, route, method) as APIResponse;
                return result;
            } catch (error) {
                throw error;
            } finally {
                setIsDisabled && setIsDisabled(false);
            }
        };

        // Use toast.promise for automatic loading, success, and error handling
        return toast.promise(apiPromise(), {
            loading: 'Please wait...',
            success: (result:APIResponse) => {
                // You can customize success message based on result
                return (result?.message ?? result?.error) || 'Request completed successfully!';
            },
            error: (error:Error) => {
                // Handle different error types
                if (error?.message) {
                    return `Error: ${error.message}`;
                }
                return 'Something went wrong. Please try again.';
            },
        });
    }
}


export const apiRequestClient = new ApiRequest; 