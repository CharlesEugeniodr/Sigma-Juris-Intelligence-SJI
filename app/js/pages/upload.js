// ============================================================
// SJIF Upload & Analysis Page
// ============================================================
window.UploadPage = {
  render() {
    const container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    const classifier = window.app && window.app.classifier;
    const analyzer = window.app && window.app.analyzer;
    const store = window.app && window.app.store;
    const taxonomy = window.SJIF_TAXONOMY;

    // --- Scoped styles ---
    const style = document.createElement('style');
    style.textContent = `
      .upload-page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-heading);
        margin-bottom: 24px;
      }
      .upload-zone-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      .upload-zone-text {
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-heading);
        margin-bottom: 6px;
      }
      .upload-zone-hint {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      .upload-file-info {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }
      .upload-file-info-item {
        text-align: center;
      }
      .upload-file-info-label {
        font-size: 0.7rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
      }
      .upload-file-info-value {
        font-size: 0.95rem;
        color: var(--text-heading);
        font-weight: 500;
        word-break: break-all;
      }
      .upload-preview {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(212,175,55,0.08);
        border-radius: var(--radius-sm);
        padding: 16px;
        max-height: 200px;
        overflow-y: auto;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
        margin-bottom: 20px;
      }
      .upload-classification {
        padding: 20px;
        background: rgba(212,175,55,0.04);
        border: 1px solid rgba(212,175,55,0.12);
        border-radius: var(--radius-sm);
        margin-bottom: 20px;
      }
      .upload-classification-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-heading);
        margin-bottom: 12px;
      }
      .upload-classification-main {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .upload-classification-type {
        font-size: 1.1rem;
        color: var(--gold);
        font-weight: 600;
      }
      .upload-alternatives {
        margin-top: 8px;
      }
      .upload-alternatives-title {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }
      .upload-alt-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(255,255,255,0.04);
        border-radius: var(--radius-xs);
        margin-right: 8px;
        margin-bottom: 6px;
        font-size: 0.8rem;
        color: var(--text);
      }
      .upload-alt-conf {
        color: var(--text-muted);
        font-size: 0.75rem;
      }
      .upload-override {
        margin-bottom: 20px;
      }
      .upload-override label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }
      .upload-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 20px;
      }
      .btn-lg {
        padding: 14px 32px;
        font-size: 1rem;
      }
      .upload-processing {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(52,152,219,0.08);
        border: 1px solid rgba(52,152,219,0.2);
        border-radius: var(--radius-sm);
        margin-top: 16px;
        color: var(--info);
        font-size: 0.9rem;
      }
      .upload-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(52,152,219,0.3);
        border-top-color: var(--info);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    container.appendChild(style);

    // --- Title ---
    var title = document.createElement('h2');
    title.className = 'upload-page-title animate-in';
    title.textContent = 'Upload & Análise de Documentos';
    container.appendChild(title);

    // --- Upload Zone ---
    var uploadCard = document.createElement('div');
    uploadCard.className = 'card animate-in';

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.md,.pdf,.docx';
    fileInput.style.display = 'none';
    fileInput.id = 'upload-file-input';

    var zone = document.createElement('div');
    zone.className = 'upload-zone';
    zone.id = 'upload-drop-zone';
    zone.innerHTML =
      '<div class="upload-zone-icon">📤</div>' +
      '<div class="upload-zone-text">Arraste arquivos aqui ou clique para selecionar</div>' +
      '<div class="upload-zone-hint">Formatos aceitos: .txt, .md, .pdf, .docx</div>';
    zone.appendChild(fileInput);

    uploadCard.appendChild(zone);
    container.appendChild(uploadCard);

    // --- Result area (hidden initially) ---
    var resultDiv = document.createElement('div');
    resultDiv.id = 'upload-result';
    resultDiv.style.display = 'none';
    container.appendChild(resultDiv);

    // --- State ---
    var state = {
      fileName: '',
      fileSize: 0,
      fileType: '',
      text: '',
      classification: null,
      selectedType: null
    };

    // --- Zone events ---
    zone.addEventListener('click', function(e) {
      if (e.target !== fileInput) fileInput.click();
    });

    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('drag-over');
      var files = e.dataTransfer.files;
      if (files.length > 0) handleFile(files[0]);
    });

    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
    });

    function handleFile(file) {
      state.fileName = file.name;
      state.fileSize = file.size;
      state.fileType = file.type || file.name.split('.').pop();

      var ext = (file.name.split('.').pop() || '').toLowerCase();

      if (ext === 'pdf' || ext === 'docx') {
        // Binary files: upload to backend for server-side text extraction
        var formData = new FormData();
        formData.append('file', file);

        var token = window.app && window.app.auth && window.app.auth.token;
        var headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;

        fetch('/api/documents/upload', {
          method: 'POST',
          headers: headers,
          body: formData
        })
        .then(function(resp) {
          if (!resp.ok) throw new Error('Upload falhou: ' + resp.status);
          return resp.json();
        })
        .then(function(data) {
          state.text = data.content || '';
          showFileResult();
        })
        .catch(function(err) {
          window.SJIFUtils.showToast('Erro ao processar arquivo: ' + (err.message || err), 'error');
        });
      } else {
        // Plain text files (.txt, .md): read directly in the browser
        var reader = new FileReader();
        reader.onload = function(e) {
          state.text = e.target.result;
          showFileResult();
        };
        reader.onerror = function() {
          window.SJIFUtils.showToast('Erro ao ler o arquivo.', 'error');
        };
        reader.readAsText(file, 'UTF-8');
      }
    }

    function showFileResult() {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '';

      // File info card
      var infoCard = document.createElement('div');
      infoCard.className = 'card animate-in';
      infoCard.innerHTML =
        '<div class="card-header">Informações do Arquivo</div>' +
        '<div class="card-body">' +
          '<div class="upload-file-info">' +
            '<div class="upload-file-info-item">' +
              '<div class="upload-file-info-label">Nome</div>' +
              '<div class="upload-file-info-value">' + window.SJIFUtils.truncate(state.fileName, 40) + '</div>' +
            '</div>' +
            '<div class="upload-file-info-item">' +
              '<div class="upload-file-info-label">Tamanho</div>' +
              '<div class="upload-file-info-value">' + window.SJIFUtils.formatFileSize(state.fileSize) + '</div>' +
            '</div>' +
            '<div class="upload-file-info-item">' +
              '<div class="upload-file-info-label">Tipo</div>' +
              '<div class="upload-file-info-value">' + (state.fileType || 'N/A') + '</div>' +
            '</div>' +
          '</div>' +
          '<pre class="upload-preview">' + escapeHtml(state.text.substring(0, 500)) + (state.text.length > 500 ? '\n...' : '') + '</pre>' +
          '<div class="upload-actions">' +
            '<button class="btn btn-secondary" id="btn-classify">🏷️ Classificar Tipo</button>' +
          '</div>' +
          '<div id="upload-classification-area"></div>' +
        '</div>';
      resultDiv.appendChild(infoCard);

      // Classify button handler
      document.getElementById('btn-classify').addEventListener('click', function() {
        runClassification();
      });

      window.SJIFUtils.animateIn(infoCard, 100);
    }

    function runClassification() {
      if (!classifier) {
        window.SJIFUtils.showToast('Classificador não disponível.', 'warning');
        return;
      }

      var result = classifier.classify(state.text);
      state.classification = result;
      state.selectedType = result.typeCode;

      var area = document.getElementById('upload-classification-area');
      area.innerHTML = '';

      var classDiv = document.createElement('div');
      classDiv.className = 'upload-classification';

      var confBadgeClass = 'badge-info';
      if (result.confidence >= 70) confBadgeClass = 'badge-success';
      else if (result.confidence >= 40) confBadgeClass = 'badge-warning';
      else confBadgeClass = 'badge-danger';

      var html =
        '<div class="upload-classification-title">Resultado da Classificação</div>' +
        '<div class="upload-classification-main">' +
          '<span class="upload-classification-type">' + (result.typeName || 'Desconhecido') + '</span>' +
          '<span class="badge">' + (result.typeCode || 'N/A') + '</span>' +
          '<span class="badge ' + confBadgeClass + '">' + result.confidence + '% confiança</span>' +
        '</div>';

      // Top 3 alternatives
      var alts = (result.allScores || []).slice(1, 4);
      if (alts.length > 0) {
        html += '<div class="upload-alternatives">' +
          '<div class="upload-alternatives-title">Alternativas</div>';
        alts.forEach(function(alt) {
          var info = (classifier._typeInfo && classifier._typeInfo[alt.typeCode]) || {};
          html += '<span class="upload-alt-item">' +
            (info.name || alt.typeCode) +
            ' <span class="upload-alt-conf">(' + Math.min(100, Math.round((alt.score / 40) * 100)) + '%)</span>' +
            '</span>';
        });
        html += '</div>';
      }
      classDiv.innerHTML = html;
      area.appendChild(classDiv);

      // Override select
      var overrideDiv = document.createElement('div');
      overrideDiv.className = 'upload-override';
      var overrideHtml = '<label for="upload-type-override">Substituir tipo (opcional)</label>' +
        '<select class="select" id="upload-type-override">' +
        '<option value="">— Manter classificação automática —</option>';
      if (taxonomy && taxonomy.types) {
        taxonomy.types.forEach(function(t) {
          var code = t.code || t.typeCode || t.id;
          var name = t.name || t.typeName || code;
          overrideHtml += '<option value="' + code + '"' + (code === result.typeCode ? ' selected' : '') + '>' + name + '</option>';
        });
      }
      overrideHtml += '</select>';
      overrideDiv.innerHTML = overrideHtml;
      area.appendChild(overrideDiv);

      document.getElementById('upload-type-override').addEventListener('change', function() {
        if (this.value) state.selectedType = this.value;
        else state.selectedType = result.typeCode;
      });

      // Analyze button
      var analyzeBtn = document.createElement('button');
      analyzeBtn.className = 'btn btn-primary btn-lg';
      analyzeBtn.textContent = '🔍 Analisar Documento';
      analyzeBtn.addEventListener('click', function() {
        runAnalysis();
      });
      area.appendChild(analyzeBtn);
    }

    async function runAnalysis() {
      if (!analyzer || !store) {
        window.SJIFUtils.showToast('Módulos de análise ou armazenamento não disponíveis.', 'warning');
        return;
      }

      // Show processing indicator
      var processingDiv = document.createElement('div');
      processingDiv.className = 'upload-processing';
      processingDiv.innerHTML = '<div class="upload-spinner"></div> Analisando documento...';
      resultDiv.appendChild(processingDiv);

      try {
        var analysis = await analyzer.analyze(state.text);

        // Determine type info
        var typeCode = state.selectedType || (state.classification ? state.classification.typeCode : 'desconhecido');
        var typeName = 'Documento';
        var category = 'Outros';
        if (state.classification) {
          typeName = state.classification.typeName || typeName;
          category = state.classification.category || category;
        }
        // Check override
        if (taxonomy && taxonomy.types && state.selectedType) {
          var found = taxonomy.types.find(function(t) {
            return (t.code || t.typeCode || t.id) === state.selectedType;
          });
          if (found) {
            typeName = found.name || found.typeName || typeName;
            category = found.category || category;
          }
        }

        var docId = window.SJIFUtils.generateId();
        var doc = {
          id: docId,
          name: state.fileName,
          fileName: state.fileName,
          text: state.text,
          typeCode: typeCode,
          typeName: typeName,
          type: typeName,
          category: category,
          analysis: analysis,
          fileSize: state.fileSize,
          createdAt: new Date().toISOString(),
          date: new Date().toISOString()
        };

        await store.addDocument(doc);
        window.SJIFUtils.showToast('Documento analisado e salvo com sucesso!', 'success');
        if(window.SJIF_notify) SJIF_notify('Documento analisado com sucesso!', 'success');
        window.location.hash = '#/analysis/' + docId;
      } catch (err) {
        processingDiv.remove();
        window.SJIFUtils.showToast('Erro na análise: ' + (err.message || err), 'error');
      }
    }

    function escapeHtml(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // --- Animate in ---
    window.SJIFUtils.staggerIn(container.querySelectorAll('.animate-in'), 80);
  }
};
