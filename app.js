window.addEventListener("load", () => loadPreviousItems());

function loadPreviousItems() {
  /*for (let i = 0; i < sessionStorage.length; i++) {
    document.querySelector("#queued-items").append(createItem(sessionStorage.key(i), sessionStorage.getItem(sessionStorage.key(i))));
  }*/
  if (localStorage.getItem(window.location.href)) {
    const localStorageArray = JSON.parse(localStorage.getItem(window.location.href));
    localStorageArray.forEach((localStorageItem) => {
      document.querySelector("#queued-items").append(createItem(localStorageItem.url, localStorageItem.name));
    });
  }
}

function addItem(element, event) {
  if (event.type !== "keypress" || event.key === "Enter") {
    element = element.parentElement;
    const url = element.querySelector("#add-url");
    const name = element.querySelector("#add-name");
    if (url.value !== "" && !Array.from(document.querySelectorAll("li > .url")).some((item) => item.value === url.value) && (name.value === "" || !Array.from(document.querySelectorAll("li > .name")).some((item) => item.value === name.value))) {
      document.querySelector("#queued-items").append(createItem(url.value, name.value));
      url.value = "";
      name.value = "";
      saveItems();
    }
  }
}

function saveItems() {
  const items = [];
  document.querySelectorAll("li").forEach((item) => items.push({ url: item.querySelector(".url").value, name: item.querySelector(".name").value }));
  localStorage.setItem(window.location.href, JSON.stringify(items));
}

function createItem(url, name) {
  const item = document.createElement("li");
  item.innerHTML = `
  <input type="text" class="url" value="${url}" readonly />
  <input type="text" class="name" value="${name}" placeholder="default name" readonly />
  <div class="delete-item" onclick="removeItem(this);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
  </div>
  `;
  return item;
}

function removeItem(item) {
  item = item.parentElement;
  item.remove();
  saveItems();
}

async function run() {
  const files = document.querySelectorAll("li").length;
  if (!Array.from(document.querySelectorAll("#choose-domain input[type=checkbox]")).some((domain) => domain.checked)) alert("At least one domain needs to be used.");
  else if (confirm("Run? (download " + files + (files === 1 ? " file" : " files") + " and run)")) {
    const payload = {
      slug: "dr12ak/",
      newTitle: "",
      text: String.raw`{"cells":[{"cell_type":"code","execution_count":null,"metadata":{},"outputs":[],"source":["!pip install -q torch==2.0.1+cu118 torchvision==0.15.2+cu118 torchaudio==2.0.2+cu118 torchtext==0.15.2 torchdata==0.6.1 --extra-index-url https://download.pytorch.org/whl/cu118 -U\n","!pip install -q xformers==0.0.20 triton==2.0.0 gradio_client==0.2.7 -U\n","    \n","%cd /kaggle/working/\n","\n","!git clone https://github.com/dr12ak/test\n","\n","!git clone https://github.com/dr12ak/test-autocomplete /kaggle/working/test/extensions/tagcomplete\n","\n","import requests\n","# EMBEDDINGS\n","\n","response = requests.get(\"https://github.com/dr12ak/test-embeddings/raw/main/embeddings.zip\")\n","with open(\"/kaggle/working/test/embeddings/embeddings.zip\", \"wb\") as f:\n","  f.write(response.content)\n","\n","#!wget https://github.com/dr12ak/test-embeddings/raw/main/embeddings.zip -O /kaggle/working/test/embeddings/embeddings.zip --retry-connrefused --waitretry=1 --read-timeout=20 --timeout=15 -t 0\n","!unzip -j /kaggle/working/test/embeddings/embeddings.zip -d /kaggle/working/test/embeddings/\n","!rm /kaggle/working/test/embeddings/embeddings.zip\n","\n","# !cp -R /kaggle/input/embeddings/embeddings /kaggle/working/test/embeddings\n","\n","response = requests.get(\"https://civitai.com/api/download/models/4938\")\n","with open(\"/kaggle/working/test/models/Stable-diffusion/model.safetensors\", \"wb\") as f:\n","  f.write(response.content)\n","\n","response = requests.get(\"https://huggingface.co/ckpt/anything-v3.0/resolve/main/Anything-V3.0.vae.pt\")\n","with open(\"/kaggle/working/test/models/Stable-diffusion/model.vae.pt\", \"wb\") as f:\n","  f.write(response.content)\n","\n","#!wget https://civitai.com/api/download/models/4938 -O /kaggle/working/test/models/Stable-diffusion/model.safetensors --retry-connrefused --waitretry=1 --read-timeout=20 --timeout=15 -t 0\n","#!wget https://huggingface.co/ckpt/anything-v3.0/resolve/main/Anything-V3.0.vae.pt -O /kaggle/working/test/models/Stable-diffusion/model.vae.pt --retry-connrefused --waitretry=1 --read-timeout=20 --timeout=15 -t 0\n","\n","%cd /kaggle/working/test \n","!git reset --hard\n","!git -C /kaggle/working/test/repositories/stable-diffusion-stability-ai reset --hard\n","\n","# DOWNLOAD LORA\n","import os\n","import re\n","lora_path = \"/kaggle/working/test/models/Lora/\"\n","\n","!mkdir {lora_path}\n","!mkdir {os.path.join(lora_path, \"rename/\")}\n","\n","def rename_file(name = None):\n","  for file in os.listdir(os.path.abspath(os.path.join(lora_path, \"rename/\"))):\n","    if os.path.isdir(os.path.join(lora_path, \"rename/\", file)):\n","      continue\n","    extension = os.path.splitext(file)[1]\n","    if name is None:\n","      name = os.path.splitext(file)[0]\n","    \n","    if os.path.exists(os.path.join(lora_path, name + extension)):\n","      file_index = 0\n","      while os.path.exists(os.path.join(lora_path, name + str(file_index) + extension)):\n","        file_index += 1\n","      name = name + str(file_index)\n","    \n","    os.rename(os.path.join(lora_path, \"rename/\", file), os.path.join(lora_path, name + extension))\n","\n","def download_files(files):\n","  # https://superuser.com/questions/493640/how-to-retry-connections-with-wget\n","  for file in files:\n","    response = requests.get(file[\"url\"], headers={\"Authorization\": \"Bearer 2a98802dbdcf9002f69afdd2a8a71845\"})\n","    name = (re.search(\"filename[^;\\n]*=(UTF-\\d['\\\"]*)?((['\\\"]).*?[.]$\\2|[^;\\n]*)?\", response.headers.get(\"Content-Disposition\"))).group(2).strip(\"\\\"\").strip(\"\\'\").strip(\"\\\"\")\n","    with open(os.path.join(lora_path, \"rename/\", name), \"wb\") as f:\n","      f.write(response.content)\n","    \n","    if \"name\" in file:\n","      rename_file(file[\"name\"])\n","    else:\n","      rename_file()\n","\n","download_files([])\n","\n","# RUN\n","# !pip install httpx==0.24.1\n","# !pip install numpy==1.22.4\n","\n","%cd /kaggle/working/test\n","!python launch.py --api --api-server-stop --xformers --enable-insecure-extension-access --no-half-vae --opt-sdp-attention --ngrok \"[authtoken]\" --ngrok-static-domain \"[domain]\" --cors-allow-origins \\*"]}],"metadata":{"kaggle":{"accelerator":"nvidiaTeslaT4","isGpuEnabled":true,"isInternetEnabled":true,"language":"python","sourceType":"notebook"},"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"},"language_info":{"codemirror_mode":{"name":"ipython","version":3},"file_extension":".py","mimetype":"text/x-python","name":"python","nbconvert_exporter":"python","pygments_lexer":"ipython3","version":"3.12.0"}},"nbformat":4,"nbformat_minor":4}`,
      language: "python",
      kernelType: "notebook",
      isPrivate: "true",
      enableGpu: "true",
      enableTpu: "false",
      enableInternet: "true",
      datasetDataSources: [],
      competitionDataSources: [],
      kernelDataSources: [],
      modelDataSources: [],
      categoryIds: [],
    };

    let downloads = [];

    document.querySelectorAll("li").forEach((item) => {
      let newDownload = { url: item.querySelector(".url").value };
      if (item.querySelector(".name").value !== "") newDownload["name"] = item.querySelector(".name").value;
      downloads.push(newDownload);
    });

    payload["text"] = payload["text"].replace("([])", "(" + JSON.stringify(downloads).replaceAll(`\"`, `\'`) + ")");
    const originalText = payload["text"];

    document.querySelector("button").disabled = true;
    document.querySelector("button").style.backgroundColor = "var(--secondary-background-color)";

    for (const domain of Array.from(document.querySelectorAll("#choose-domain input[type=checkbox]"))) {
      if (!domain.checked) continue;
      const notebookId = "n-" + new Date().getTime().toString(36);
      payload["slug"] = "dr12ak/" + notebookId;
      payload["newTitle"] = notebookId;
      payload["text"] = originalText.replace("[authtoken]", domain.dataset.authtoken).replace("[domain]", domain.name);
      const response = await fetch("https://www.kaggle.com/api/v1/kernels/push", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("dr12ak:773fd7859414f4437a58e6d806baad44"),
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Swagger-Codegen/1/python",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        document.querySelector("button").style.backgroundColor = "var(--error)";
      }
    }
  }
}
