define(['ojs/ojcore', 'text!./query-table.html', './query-table', 'text!./query-table.json', 'css!./query-table.css', 'ojs/ojcomposite'], function (oj, view, viewModel, metadata) {
        oj.Composite.register('query-table', {
            view: {inline: view},
            viewModel: {inline: viewModel},
            metadata: {inline: JSON.parse(metadata)}
    });
    }
);
