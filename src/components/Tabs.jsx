import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Tabs = ({ items, dataset, datasetMap }) => {
	const [query, setQuery] = useSearchParams();
	const [filteredDataset, setFilteredDataset] = useState(dataset);
	const [active, setActive] = useState(Number(query.get("tab")) || "_none");
	return (
		<>
			<div className="pestanas">
				{items.map(({ id, titulo, filtro }) => (
					<button
						type="button"
						key={id}
						className={id === active ? "activa" : ""}
						onClick={() => {
							setActive(id);
							setQuery({ tab: id });
							setFilteredDataset(
								active === "_none" ? dataset : dataset.filter(filtro),
							);
						}}
					>
						{titulo}
					</button>
				))}
			</div>
			<div className="lista-historias">{filteredDataset.map(datasetMap)}</div>
		</>
	);
};

export default Tabs;
