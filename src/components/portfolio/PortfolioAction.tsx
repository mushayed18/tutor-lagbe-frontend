import Link from "next/link";
import { Plus, Edit3 } from "lucide-react";

export default function PortfolioAction({ exists }: { exists: boolean }) {
  return (
    <div className="mt-8">
      <Link
        href={exists ? "/tutor/portfolio/edit" : "/tutor/portfolio/create"}
        className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        {exists ? (
          <>
            <Edit3 size={18} />
            Edit Portfolio
          </>
        ) : (
          <>
            <Plus size={18} />
            Create Portfolio
          </>
        )}
      </Link>
    </div>
  );
}
