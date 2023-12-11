/** 약관동의 페이지 state*/
export type CheckBoxElementType = {
	/** 화면에 표시되는 제목*/
	label: string;
	/** 필수 체크사항 여부*/
	required?: boolean;
	/** 전문보기가 존재하는 경우 해당 보기 이름 기재*/
	popup?: number;
	pageName?: string;
	val?: string;
	checked?: boolean,
};
