import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function StarRating({ rating, onRatingChange, readonly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRatingChange(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} w-6 h-6 text-yellow-400`}
        >
          {star <= rating ? (
            <StarSolid className="w-6 h-6" />
          ) : (
            <StarOutline className="w-6 h-6" />
          )}
        </button>
      ))}
    </div>
  );
}