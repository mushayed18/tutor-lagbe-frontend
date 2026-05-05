import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="p-10 flex gap-4">
      <Button variant="primary">Register Now</Button>
      <Button variant="outline">Learn More</Button>
    </div>
  );
}