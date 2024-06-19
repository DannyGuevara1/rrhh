"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import { EyeIcon,PencilSquareIcon,TrashIcon } from "@heroicons/react/24/outline";


export default function JobsDescriptorPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/puesto/allFilter",
        );
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Card isFooterBlurred className="border-none inline-block" radius="lg">
        <Image
          alt="Add document"
          className="object-cover"
          height={250}
          src="https://firebasestorage.googleapis.com/v0/b/storage-18068.appspot.com/o/resources%2F4351368.jpg?alt=media&token=199d2d9b-ecd0-4d97-8682-919e166cd84d"
          width={250}
        />
        <CardFooter className="justify-between before:bg-gray-700/10 border-stone-600/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-slate-800/100">Crear nuevo documento.</p>
          <Link href="/dashboard/JobsDescriptor/create">
            <Button
              className="text-tiny text-white bg-black/70"
              color="default"
              radius="lg"
              size="sm"
              variant="flat"
            >
              Crear
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Divider className="my-10 w-full" />

      <Table aria-label="Jobs Table">
        <TableHeader>
          <TableColumn>Titulo</TableColumn>
          <TableColumn>Actualizado</TableColumn>
          <TableColumn>Departamento</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id_puesto} style={{ height: "3.7rem" }}>
              <TableCell>{job.titulo}</TableCell>
              <TableCell>{new Date(job.updated_at).toLocaleString()}</TableCell>
              <TableCell>{job.departamento.nombre}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="View">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Link
                        href={`/dashboard/JobsDescriptor/view/${job.id_puesto}`}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Link
                        href={`/dashboard/JobsDescriptor/edit/${job.id_puesto}`}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <TrashIcon
                        className="h-5 w-5"
                        onClick={() => handleDelete(job.id_puesto)}
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:8080/api/v1/puesto/delete/${id}`, {
        method: "DELETE",
      });
      setJobs(jobs.filter((job) => job.id_puesto !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  }
}
