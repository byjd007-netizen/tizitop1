document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        const answer = item.querySelector('.faq-answer');
        
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            if (!isActive) {
                item.classList.add('active');
                // Set max-height to scrollHeight to enable smooth transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });

    // 2. Comparison Table Filter & Sort
    const filterProtocol = document.getElementById('filter-protocol');
    const filterStreaming = document.getElementById('filter-streaming');
    const sortTable = document.getElementById('sort-table');
    const compareTable = document.getElementById('compare-table-body');
    
    if (compareTable && filterProtocol && filterStreaming && sortTable) {
        const originalRows = Array.from(compareTable.querySelectorAll('tr'));
        
        function updateTable() {
            const protocolVal = filterProtocol.value;
            const streamingVal = filterStreaming.value;
            const sortVal = sortTable.value;
            
            // Filter
            let filteredRows = originalRows.filter(row => {
                const rowProtocols = row.getAttribute('data-protocols').split(',');
                const rowStreaming = row.getAttribute('data-streaming').split(',');
                
                const matchProtocol = (protocolVal === 'all') || rowProtocols.includes(protocolVal);
                const matchStreaming = (streamingVal === 'all') || rowStreaming.includes(streamingVal);
                
                return matchProtocol && matchStreaming;
            });
            
            // Sort
            if (sortVal === 'price-asc') {
                filteredRows.sort((a, b) => {
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                });
            } else if (sortVal === 'price-desc') {
                filteredRows.sort((a, b) => {
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                });
            } else if (sortVal === 'date-desc') {
                filteredRows.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateB - dateA;
                });
            }
            
            // Clear and Render
            compareTable.innerHTML = '';
            if (filteredRows.length === 0) {
                const noResultRow = document.createElement('tr');
                noResultRow.innerHTML = `<td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    没有找到符合筛选条件的加速服务商
                </td>`;
                compareTable.appendChild(noResultRow);
            } else {
                filteredRows.forEach(row => {
                    compareTable.appendChild(row);
                });
            }
        }
        
        filterProtocol.addEventListener('change', updateTable);
        filterStreaming.addEventListener('change', updateTable);
        sortTable.addEventListener('change', updateTable);
    }
});
