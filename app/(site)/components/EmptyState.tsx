import getCurrentUser from '@/app/actions/getCurrentUser';


const EmptyState = async () => {

  const currentUser = await getCurrentUser();

  let divClassName = `px-4 py-10 sm:px-6 lg:px-8 lg:py-6 h-full flex justify-center items-center`;
  let h3ClassName = `mt-2 text-2xl font-semibold`;

  if (currentUser?.isDarkTheme) {
    divClassName += ` bg-gray-800`;
    h3ClassName += ` text-gray-100`;
  } else {
    divClassName += ` bg-gray-100`;
    h3ClassName += ` text-gray-800`;
  }

  return ( 
      <div className={divClassName}>
        <div className="text-center items-center flex flex-col">
          <h3 className={h3ClassName}>
          Welcome to ChitChat
        </h3>
      </div>
    </div>
  );
}
   
  export default EmptyState;