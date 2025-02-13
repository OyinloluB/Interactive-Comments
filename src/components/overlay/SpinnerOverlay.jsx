const SpinnerOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
    </div>
  );
};

export default SpinnerOverlay;
