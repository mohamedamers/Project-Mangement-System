type HeaderProps = {
  title: string;
  btn_text?: string;
  onBtnClick?: () => void;
};

export default function Header({ title, btn_text, onBtnClick }: HeaderProps) {

  return (
    <>
      <header className="bg-white overflow-hidden rounded rounded-4 my-2">
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-between p-3 text-white">
            <h3 className="text-black   m-3">{title}</h3>
            {btn_text && (
              <button
                type="button"
                className="btn primarycolorbg m-3 px-3 rounded-5"
                onClick={onBtnClick}
              >
                <i className="fa-solid fa-plus me-3 text-white" />
                {btn_text}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
