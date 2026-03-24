import CreateExamForm from "./CreateExamForm";

export default function CreateExamPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Exam</h1>
          <p className="text-gray-600 dark:text-gray-400">Set up a new exam with title and duration</p>
        </div>
        <CreateExamForm />
      </div>
    </div>
  );
}
