import toast, { ToastPosition } from 'react-hot-toast';

export const successToast = (message: string) => {
	toast.success(message, { position: 'top-center' });
};

export const errorToast = (message: string) => {
	toast.error(message, { position: 'top-center' });
};

export const promiseToast = async ({
	cb,
	errMsg,
	successMsg,
	loadingMsg,
	position
}: {
	cb: (arg?: any) => Promise<any>;
	errMsg: string;
	successMsg: string;
	loadingMsg: string;
	position: ToastPosition;
}) => {
	await toast.promise(
		cb(),
		{
			error: errMsg,
			success: successMsg,
			loading: loadingMsg
		},
		{ position }
	);
};
