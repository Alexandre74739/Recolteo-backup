export default function Btns() {
    return (
        <div>
            <button className="bg-color-sapin">
                Click moi
            </button>
        </div>
    )
}

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "foruthary";
}

const Button = ({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

<Button label="Valider" onClick={() => alert("OK")} variant="primary" />
