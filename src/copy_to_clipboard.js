document.querySelectorAll('pre:has(>code)').forEach((preElement) => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="far fa-copy"></i>';
  button.classList.add('code-copy-button');
  button.dataset.tooltip = "Copy to clipboard";

  preElement.appendChild(button);

  button.addEventListener('click', () => {
    // Specifically grab the code inside the <code> tag
    const codeElement = preElement.querySelector('code');
    const codeText = codeElement.innerText;

    navigator.clipboard.writeText(codeText).then(() => {
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
      }, 2000);
    });
  });
});