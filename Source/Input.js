
function Input(name, keyCode)
{
	this.name = name;
	this.keyCode = keyCode;
}

{
	function Input_Instances()
	{
		if (Input.Instances == null)
		{
			Input.Instances = this;
		}

		this.A = new Input("A", 65);
		this.C = new Input("C", 67);
		this.D = new Input("D", 68);
		this.E = new Input("E", 69);
		this.F = new Input("F", 70);
		this.R = new Input("R", 82);
		this.S = new Input("S", 83);
		this.W = new Input("W", 87);
		this.X = new Input("X", 88);
		this.Z = new Input("Z", 90);

		this.Space = new Input("Space", 32);

		this.MouseButton = new Input("MouseButton", "MouseButton");

		this._All = 
		[
			this.A,
			this.C,
			this.D,
			this.E,
			this.F,
			this.R,
			this.S,
			this.W,
			this.X,
			this.Z,

			this.Space,

			this.MouseButton,
		];

		return Input.Instances;
	}

	Input.Instances = new Input_Instances();
}
