import { toast } from "sonner";
import { ApiError } from "../services/api";

// Shows an error as a toast. Identical errors share one toast instead of stacking.
export const showErrorToast = (error: unknown) => {
	if (error instanceof ApiError) {
		toast.error(error.message, {
			id: `${error.message}|${error.serverMessage}`,
			description: error.serverMessage ?? undefined,
		});
		return;
	}

	const message = error instanceof Error ? error.message : "Something went wrong";
	toast.error(message, { id: message });
};
