interface ToastCardProps {
    text: string;
    isSuccess?: boolean;
    isError?: boolean;
}

export const ToastCard = ({
    text,
    isSuccess,
    isError,
}: ToastCardProps) => {
    return (
        <div
            className={`
      flex justify-start min-w-50
      ${isSuccess ? 'text-green-600' : ''}
      ${isError ? 'text-red-600' : ''}
    `}>
            <span className="text-sm font-semibold text-card">{text}</span>
        </div>
    );
    
};