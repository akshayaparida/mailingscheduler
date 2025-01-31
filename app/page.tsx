import Header from './components/Header';
import Footer from './components/Footer';
import ScheduleForm from './components/ScheduleForm';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ScheduleForm />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
