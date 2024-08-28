import ShowTasks from "./component/ShowTasks";
import TaskForm from "./component/TaskForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-slate-400">
        <div className="flex gap-2 p-4">
          <div className="">
            <TaskForm />
          </div>
          <div className="">
            <ShowTasks />
          </div>
        </div>
      </div>
    </main>
  );
}
