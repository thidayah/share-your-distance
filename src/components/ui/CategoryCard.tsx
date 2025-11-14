import Button from "./Button"
import Link from "next/link";
import { TypesCategory } from "@/types/database";

interface CategoryCardProps {
  item: TypesCategory;
  index: number;
  className?: string;
}

export default function CategoryCard({ item, index }: CategoryCardProps) {
  return (
    <div
      key={item.id}
      className={`
                    relative p-8 transition-all duration-500 hover:scale-105
                    ${item.recommended
          ? 'border-zinc-500 bg-zinc-800 shadow-xl'
          : 'border-neutral-200 bg-zinc-900 shadow-lg hover:shadow-xl'
        }
                    animate-slide-up
                  `}
      // style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Recommended Badge */}
      {item.recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Category Header */}
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-4`}>
          {item.name}
        </h3>
        <div className={`text-3xl font-bold mb-2`}>
          IDR {item.price.toLocaleString()}
          <span className="text-sm font-normal text-zinc-400 block">
            {item.id === 'estafet-200m' ? 'per team' : 'per person'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className=" mb-8 text-center">
        {item.description}
      </p>

      {/* Features List */}
      <ul className="space-y-4 mb-8">
        {item.category_features?.map((feat, fIndex) => (
          <li key={fIndex} className="flex items-center">
            <svg
              className={`w-5 h-5 mr-3 flex-shrink-0 ${item.recommended ? 'text-blue-500' : 'text-zinc-500'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="">{feat?.feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="text-center">
        <Link href={`/register/${item.id}`}>
          <Button
            variant={item.recommended ? 'primary' : 'outline'}
            size="md"
            fullWidth
            className={`
                          ${item.recommended
                ? 'bg-zinc-700 hover:bg-zinc-600'
                : 'border-zinc-200 text-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }
                        `}
          >
            Register Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
