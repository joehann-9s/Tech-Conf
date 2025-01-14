import { signInWithGitHub, getUser } from "@services/auth";
import { insertDataIntoTable, getTicketRecord } from "@services/config";
import type { User } from "@interfaces/user";
import Swal from "sweetalert2";

interface Props {
  id: number;
}

export default function GetTicket(props: Props) {
  const { id } = props;

  const handleIsSubscribed = async (user: User) => {
    const { length } = await getTicketRecord(String(id), user.id);

    return length > 0;
  };

  const handleSubscribe = async () => {
    const user = (await getUser()) as User | null;

    if (!user) {
      const url = `${window.location.origin}/events/1`;
      signInWithGitHub(url);
      return;
    }

    const isSubscribed = await handleIsSubscribed(user);

    if (isSubscribed) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Ya te has inscrito a este evento",
      });
      return;
    }

    const response = await insertDataIntoTable("tickets", {
      user_id: user.id,
      event_id: id,
    });

    if (!response) {
      Swal.fire({
        icon: "success",
        title: "Oops...",
        text: "Algo salió mal, intentalo de nuevo",
      });

      return;
    }

    window.location.reload();
  };

  return (
    <>
      <button
        onClick={handleSubscribe}
        className="mt-10 bg-yellow-500 p-3 font-medium text-black border-black border-2 rounded-md hover:scale-125 hover:duration-300"
      >
        Consigue tu ticket!
      </button>
      <p className="mt-2">Es gratis!</p>
    </>
  );
}
