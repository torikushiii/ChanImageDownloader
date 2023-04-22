/* eslint-disable no-undef */
const sidebar = document.querySelector(".sidebar");

const renderFolders = async () => {
	const res = await fetch(`/api/folders?${Date.now()}`);
	const folders = await res.json();
	const html = folders.map(folder => `
            <li class="sidebar-folder">
                <a href="/folders/${folder}">${folder}</a>
            </li>
            `).join("");
        
	sidebar.innerHTML = html;
};

renderFolders();
