import { Modal } from "bootstrap";

export function addDemoMessage() {
  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('demoModalShown')) {
      return;
    }

    const content =
      `<div class="modal fade" id="demo-message-modal" tabindex="-1" aria-labelledby="demo-message-modal-title">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="demo-message-modal-title">MikePay Demo</h5>
              <button type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Schließen"></button>
            </div>
            <div class="modal-body">
              <p>
                Diese Demo arbeitet ausschließlich im Browser. Alle Änderungen werden nur lokal gespeichert. Viel Spaß!
              </p>
              <h2 class="fs-4">Testlogins</h2>
              Admin
              <ul>
                <li>Benutzername: mike</li>
                <li>Passwort: Test1234</li>
              </ul>
              Benutzer
              <ul>
                <li>Benutzernamen: user1 - user30</li>
                <li>Passwort: Test1234</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>`;

    const tempContainer = document.createElement('DIV');
    tempContainer.innerHTML = content;
    const modalElement = tempContainer.firstElementChild;

    document.body.appendChild(modalElement);

    modalElement.addEventListener('hidden.bs.modal', () => {
      sessionStorage.setItem('demoModalShown', 'true');
    });

    const modal = new Modal(modalElement);
    modal.show();
  });
}
