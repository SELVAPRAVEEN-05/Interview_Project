
import { CollaborativeEditor } from "@/component/editor";
import { Room } from "./Room";

export default function Home() {
  return (
    <main>
      <Room>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}