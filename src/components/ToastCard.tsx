interface ToastCardProps {
  text: string;
  isSuccess?: boolean;
  isError?: boolean;
}

export const ToastCard = ({ text, isSuccess, isError }: ToastCardProps) => {
  return (
    <div className={`
      flex items-center gap-3 px-2 py-1 min-w-[200px]
      ${isSuccess ? 'text-green-600' : ''}
      ${isError ? 'text-red-600' : ''}
    `}>
      {/* Você pode adicionar ícones aqui também */}
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
}