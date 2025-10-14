type Props = {
  todo: string;
  done: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TodoItem({ todo, done, onToggle, onDelete }: Props) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span
        className={`flex-1 ${done ? 'line-through text-gray-400' : ''}`}
        onClick={onToggle}
      >
        {todo}
      </span>
      <button onClick={onDelete} className="text-red-500 ml-2">삭제</button>
    </div>
  );
}
