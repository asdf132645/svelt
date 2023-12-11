/** 실행을 한 번만 하도록 하는 함수*/
export const once = (fn: any) => {
	let isDone = false;
	return (...args: any) => (isDone ? undefined : ((isDone = true), fn.apply(this, args)));
};
