document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('canvas-container');
    const overlay = document.getElementById('concept-overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const conceptTitleEl = document.getElementById('concept-title');
    const myTakeEl = document.querySelector('#concept-my-take p');
    const visualizationContainer = document.getElementById('visualization-container');
    const toolContainer = document.getElementById('tool-container');
    const formalContentEl = document.getElementById('formal-content');
    const connectionsListEl = document.getElementById('connections-list');
    const resourcesListEl = document.getElementById('resources-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const subjectNavigationContainer = document.getElementById('subject-navigation'); // Add this container in HTML

    let currentTheme = 'theme-blueprint'; // Start with blueprint

    // --- NEW Data Structure: Group by Subject ---
    const mathUniverseData = {
        'calculus': {
            name: 'Calculus',
            colorPalette: { node: '#3498db', connection: 'rgba(52, 152, 219, 0.4)', highlight: '#87CEFA' },
            center: { x: 300, y: 300 },
            concepts: {
                'limits': {
                    id: 'limits',
                    title: 'Limits',
                    x: 150, y: 200,
                    radius: 40,
                    color: '#e74c3c', // Example color
                    connections: ['calculus.derivatives', 'calculus.continuity'],
                    content: {
                        myTake: "Imagine zooming in infinitely close to a point on a function's graph. The value the function *approaches* as you get ridiculously close, without actually landing *on* the point, is the limit. It's about the journey, not the destination (sometimes!).",
                        visualization: { type: 'p5', code: 'limit_viz.js' }, // We'll need to load this
                        tool: { type: 'html', html: `<p>Input a function and a point (coming soon!).</p>` },
                        formal: `
                            <p>Formally, the limit of a function $f(x)$ as $x$ approaches $c$ is $L$, written as:</p>
                            $$ \\lim_{x \\to c} f(x) = L $$
                            <p>This means that for every $\\epsilon > 0$, there exists a $\\delta > 0$ such that if $0 < |x - c| < \\delta$, then $|f(x) - L| < \\epsilon$. (The famous Epsilon-Delta definition!)</p>
                        `,
                        resources: [
                            { text: '3Blue1Brown: Essence of Calculus, Ch 1', url: '#', type: 'video' },
                            { text: 'Khan Academy: Introduction to Limits', url: '#', type: 'article' }
                        ]
                    }
                },
                'derivatives': {
                    id: 'derivatives',
                    title: 'Derivatives',
                    x: 400, y: 150,
                    radius: 50, // Make important ones bigger?
                    color: '#3498db',
                    connections: ['calculus.limits', 'calculus.integrals', 'calculus.optimization'],
                    content: {
                        myTake: "A derivative is simply the *instantaneous rate of change* of a function. Think of it as the slope of the line that just barely kisses the function's curve at a single point. It tells you how fast something is changing *right now*.",
                        visualization: { type: 'html', html: `<p>Graph with tangent line slider (soon!).</p>` },
                        tool: { type: 'html', html: `<p>Basic derivative calculator (planned).</p>` },
                        formal: `
                            <p>The derivative of $f(x)$ with respect to $x$ is denoted $f'(x)$ or $\\frac{dy}{dx}$. It's defined using a limit:</p>
                            $$ f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} $$
                            <p>Key Rules:</p>
                            <ul>
                                <li>Power Rule: $\\frac{d}{dx}(x^n) = nx^{n-1}$</li>
                                <li>Sum Rule: $(f+g)' = f' + g'$</li>
                                <li>Product Rule: $(fg)' = f'g + fg'$</li>
                                <li>Quotient Rule: $(f/g)' = \\frac{f'g - fg'}{g^2}$</li>
                                <li>Chain Rule: $(f(g(x)))' = f'(g(x)) \\cdot g'(x)$</li>
                            </ul>`,
                        resources: [
                            { text: '3Blue1Brown: Essence of Calculus, Ch 2', url: '#', type: 'video' },
                            { text: 'Paul\'s Online Math Notes: Derivatives', url: '#', type: 'notes' }
                        ]
                    }
                },
                'continuity': {
                    id: 'continuity',
                    title: 'Continuity',
                    x: 180, y: 350,
                    radius: 35,
                    color: '#2ecc71',
                    connections: ['calculus.limits', 'calculus.intermediate_value_theorem'],
                    content: {
                        myTake: "A continuous function is one you can draw without lifting your pencil. No jumps, holes, or wild vertical asymptotes! For a function to be continuous at a point, the function must be defined there, the limit must exist there, AND the function's value must equal the limit.",
                        visualization: { type: 'html', html: `<p>Interactive graph showing different discontinuities (coming!).</p>`},
                        tool: null, // No specific tool for this concept yet
                        formal: `
                            <p>A function $f(x)$ is continuous at a point $c$ if:</p>
                            <ol>
                                <li>$f(c)$ is defined.</li>
                                <li>$\\lim_{x \\to c} f(x)$ exists.</li>
                                <li>$\\lim_{x \\to c} f(x) = f(c)$.</li>
                            </ol>
                            <p>A function is continuous on an interval if it's continuous at every point in that interval.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Continuity', url: '#', type: 'article' }
                        ]
                    }
                },
                'integrals': {
                    id: 'integrals',
                    title: 'Integrals',
                    x: 600, y: 250,
                    radius: 50,
                    color: '#f1c40f',
                    connections: ['calculus.derivatives', 'calculus.fundamental_theorem'],
                    content: {
                        myTake: "Integration is often thought of as the reverse of differentiation, or finding the 'anti-derivative'. Geometrically, a definite integral represents the *area under the curve* of a function between two points. Think of slicing that area into infinitely many tiny rectangles and summing them up.",
                        visualization: { type: 'html', html: `<p>Area under curve visualization (Riemann Sums) planned.</p>`},
                        tool: { type: 'html', html: `<p>Basic integral calculator (future feature).</p>`},
                        formal: `
                            <p>The definite integral of $f(x)$ from $a$ to $b$ is:</p>
                            $$ \\int_a^b f(x) \\, dx $$
                            <p>It represents the signed area between the curve $y=f(x)$ and the x-axis. The indefinite integral finds the family of functions whose derivative is $f(x)$:</p>
                            $$ \\int f(x) \\, dx = F(x) + C $$
                            <p>where $F'(x) = f(x)$ and $C$ is the constant of integration.</p>
                            `,
                        resources: [
                            { text: '3Blue1Brown: Essence of Calculus, Ch 8', url: '#', type: 'video' },
                            { text: 'MIT OpenCourseware: Single Variable Calculus', url: '#', type: 'course' }
                        ]
                    }
                },
                'fundamental_theorem': {
                    id: 'fundamental_theorem',
                    title: 'Fundamental Theorem of Calculus',
                    x: 800, y: 300,
                    radius: 45,
                    color: '#9b59b6',
                    connections: ['calculus.integrals', 'calculus.derivatives'],
                    content: {
                        myTake: "The Fundamental Theorem of Calculus links the concept of differentiation and integration. It states that differentiation and integration are inverse processes.",
                        visualization: { type: 'html', html: `<p>Graph showing the relationship between a function and its integral (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Tool to explore the Fundamental Theorem (planned).</p>`},
                        formal: `
                            <p>The Fundamental Theorem of Calculus has two parts:</p>
                            <ol>
                                <li>If $f$ is continuous on $[a, b]$ and $F$ is the indefinite integral of $f$ on $[a, b]$, then $F$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $F'(x) = f(x)$ for all $x$ in $(a, b)$.</li>
                                <li>If $f$ is continuous on $[a, b]$, then the definite integral of $f$ from $a$ to $b$ is equal to the difference of the values of an antiderivative $F$ of $f$ at the endpoints of the interval, i.e., $$ \\int_a^b f(x) \\, dx = F(b) - F(a) $$</li>
                            </ol>
                            `,
                        resources: [
                            { text: 'Khan Academy: Fundamental Theorem of Calculus', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Fundamental Theorem of Calculus', url: '#', type: 'notes' }
                        ]
                    }
                }
            }
        },
        'linearAlgebra': {
            name: 'Linear Algebra',
            colorPalette: { node: '#e74c3c', connection: 'rgba(231, 76, 60, 0.4)', highlight: '#FFA07A' },
            center: { x: 1000, y: 800 },
            concepts: {
                'vectors': {
                    id: 'vectors',
                    title: 'Vectors',
                    x: 200, y: 200,
                    radius: 40,
                    color: '#e74c3c',
                    connections: ['linearAlgebra.matrices'],
                    content: {
                        myTake: "Vectors are quantities that have both magnitude and direction. They are fundamental in physics and engineering.",
                        visualization: { type: 'html', html: `<p>Interactive vector visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Vector calculator (planned).</p>`},
                        formal: `
                            <p>A vector is an element of a vector space. In the plane, a vector can be represented as an ordered pair $(x, y)$, and in three-dimensional space as an ordered triplet $(x, y, z)$.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Vectors', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Vectors', url: '#', type: 'notes' }
                        ]
                    }
                },
                'matrices': {
                    id: 'matrices',
                    title: 'Matrices',
                    x: 400, y: 300,
                    radius: 50,
                    color: '#e74c3c',
                    connections: ['linearAlgebra.vectors', 'linearAlgebra.matrix_operations'],
                    content: {
                        myTake: "Matrices are rectangular arrays of numbers, symbols, or expressions, arranged in rows and columns. They are used to represent linear transformations and solve systems of linear equations.",
                        visualization: { type: 'html', html: `<p>Matrix visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Matrix calculator (planned).</p>`},
                        formal: `
                            <p>A matrix is a rectangular array of numbers arranged in rows and columns. The size of a matrix is defined by the number of rows and columns it contains.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Matrices', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Matrices', url: '#', type: 'notes' }
                        ]
                    }
                },
                'matrix_operations': {
                    id: 'matrix_operations',
                    title: 'Matrix Operations',
                    x: 600, y: 400,
                    radius: 45,
                    color: '#e74c3c',
                    connections: ['linearAlgebra.matrices', 'linearAlgebra.determinants'],
                    content: {
                        myTake: "Matrix operations include addition, subtraction, and multiplication. These operations are used to solve systems of linear equations and perform linear transformations.",
                        visualization: { type: 'html', html: `<p>Matrix operations visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Matrix operations calculator (planned).</p>`},
                        formal: `
                            <p>Matrix operations include addition, subtraction, and multiplication. These operations are used to solve systems of linear equations and perform linear transformations.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Matrix Operations', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Matrix Operations', url: '#', type: 'notes' }
                        ]
                    }
                },
                'determinants': {
                    id: 'determinants',
                    title: 'Determinants',
                    x: 800, y: 500,
                    radius: 40,
                    color: '#e74c3c',
                    connections: ['linearAlgebra.matrix_operations', 'linearAlgebra.eigen'],
                    content: {
                        myTake: "The determinant is a scalar value that can be computed from the elements of a square matrix. It provides important properties of the matrix, such as whether it is invertible.",
                        visualization: { type: 'html', html: `<p>Determinant visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Determinant calculator (planned).</p>`},
                        formal: `
                            <p>The determinant is a scalar value that can be computed from the elements of a square matrix. It provides important properties of the matrix, such as whether it is invertible.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Determinants', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Determinants', url: '#', type: 'notes' }
                        ]
                    }
                },
                'eigen': {
                    id: 'eigen',
                    title: 'Eigenvalues and Eigenvectors',
                    x: 1000, y: 600,
                    radius: 45,
                    color: '#e74c3c',
                    connections: ['linearAlgebra.determinants'],
                    content: {
                        myTake: "Eigenvalues and eigenvectors are properties of a matrix that provide insight into its behavior. They are used in many areas of mathematics and engineering.",
                        visualization: { type: 'html', html: `<p>Eigenvalues and eigenvectors visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Eigenvalues and eigenvectors calculator (planned).</p>`},
                        formal: `
                            <p>Eigenvalues and eigenvectors are properties of a matrix that provide insight into its behavior. They are used in many areas of mathematics and engineering.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Eigenvalues and Eigenvectors', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Eigenvalues and Eigenvectors', url: '#', type: 'notes' }
                        ]
                    }
                }
            }
        },
        'probability': {
            name: 'Probability & Stats',
            colorPalette: { node: '#2ecc71', connection: 'rgba(46, 204, 113, 0.4)', highlight: '#90EE90' },
            center: { x: 300, y: 1200 },
            concepts: {
                'sample_space': {
                    id: 'sample_space',
                    title: 'Sample Space',
                    x: 200, y: 200,
                    radius: 40,
                    color: '#2ecc71',
                    connections: ['probability.events'],
                    content: {
                        myTake: "The sample space is the set of all possible outcomes of a random experiment. It is the foundation of probability theory.",
                        visualization: { type: 'html', html: `<p>Sample space visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Sample space calculator (planned).</p>`},
                        formal: `
                            <p>The sample space is the set of all possible outcomes of a random experiment. It is the foundation of probability theory.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Sample Space', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Sample Space', url: '#', type: 'notes' }
                        ]
                    }
                },
                'events': {
                    id: 'events',
                    title: 'Events',
                    x: 400, y: 300,
                    radius: 50,
                    color: '#2ecc71',
                    connections: ['probability.sample_space'],
                    content: {
                        myTake: "An event is a subset of the sample space. It represents a specific outcome or set of outcomes of a random experiment.",
                        visualization: { type: 'html', html: `<p>Events visualization (coming soon!).</p>`},
                        tool: { type: 'html', html: `<p>Events calculator (planned).</p>`},
                        formal: `
                            <p>An event is a subset of the sample space. It represents a specific outcome or set of outcomes of a random experiment.</p>
                            `,
                        resources: [
                            { text: 'Khan Academy: Events', url: '#', type: 'article' },
                            { text: 'Paul\'s Online Math Notes: Events', url: '#', type: 'notes' }
                        ]
                    }
                }
            }
        }
    };

    // --- Konva Setup ---
    const stage = new Konva.Stage({
        container: 'canvas-container',
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true, // Allow panning
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const nodeGroup = new Konva.Group(); // Group for all nodes
    const lineGroup = new Konva.Group(); // Group for all connection lines
    layer.add(lineGroup); // Draw lines behind nodes
    layer.add(nodeGroup);

    // Store Konva node objects for easy access
    const konvaNodes = {};
    const subjectColors = {};
    Object.keys(mathUniverseData).forEach(subjectKey => {
        subjectColors[subjectKey] = mathUniverseData[subjectKey].colorPalette;
    });

    // --- MODIFIED Node and Connection Creation ---
    function createConceptNode(concept, subjectKey, palette) {
        const fullId = `${subjectKey}.${concept.id}`;
        const group = new Konva.Group({
            x: concept.x,
            y: concept.y,
            id: fullId,
            draggable: true,
            attrs: { subject: subjectKey, conceptId: concept.id }
        });

        const circle = new Konva.Circle({
            radius: concept.radius || 30,
            fill: palette.node || '#95a5a6',
            stroke: 'rgba(0,0,0,0.5)',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOpacity: 0.3,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
        });

        const text = new Konva.Text({
            text: concept.title,
            fontSize: 12,
            fontFamily: 'Poppins, sans-serif',
            fill: '#fff',
            align: 'center',
            verticalAlign: 'middle',
            listening: false,
        });
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2);

        group.add(circle);
        group.add(text);

        group.on('click tap', () => {
            if (!stage.isDragging()) {
                const conceptData = mathUniverseData[subjectKey]?.concepts[concept.id];
                if (conceptData) {
                    populateOverlay(conceptData, subjectKey);
                    overlay.classList.add('visible');
                }
            }
        });

        group.on('mouseover', () => {
            stage.container().style.cursor = 'pointer';
            circle.scaleX(1.1);
            circle.scaleY(1.1);
            highlightConnections(fullId, true);
            layer.batchDraw();
        });

        group.on('mouseout', () => {
            stage.container().style.cursor = 'grab';
            circle.scaleX(1);
            circle.scaleY(1);
            highlightConnections(fullId, false);
            layer.batchDraw();
        });

        group.on('dragmove', () => {
            updateConnections(fullId);
            layer.batchDraw();
        });

        nodeGroup.add(group);
        konvaNodes[fullId] = group;
    }

    function createConnectionLine(fromNode, toNode) {
        if (!fromNode || !toNode) return null;

        const fromSubject = fromNode.attrs.subject;
        const toSubject = toNode.attrs.subject;
        const fromFullId = fromNode.id();
        const toFullId = toNode.id();

        let strokeColor = subjectColors[fromSubject]?.connection || 'rgba(150, 150, 150, 0.5)';
        let strokeWidth = 2;
        let dash = [5, 5];

        if (fromSubject !== toSubject) {
            strokeColor = 'rgba(255, 215, 0, 0.7)';
            strokeWidth = 3;
            dash = [10, 8];
        }

        const line = new Konva.Line({
            points: [fromNode.x(), fromNode.y(), toNode.x(), toNode.y()],
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            lineCap: 'round',
            dash: dash,
            listening: false,
            attrs: { from: fromFullId, to: toFullId, isCrossSubject: fromSubject !== toSubject }
        });
        lineGroup.add(line);
        return line;
    }

    // Function to update lines when a node is dragged
    function updateConnections(nodeId) {
        lineGroup.find('Line').forEach(line => {
            if (line.attrs.from === nodeId) {
                const fromNode = konvaNodes[nodeId];
                line.points([fromNode.x(), fromNode.y(), line.points()[2], line.points()[3]]);
            } else if (line.attrs.to === nodeId) {
                const toNode = konvaNodes[nodeId];
                line.points([line.points()[0], line.points()[1], toNode.x(), toNode.y()]);
            }
        });
    }

    // Function to highlight lines connected to a node
    function highlightConnections(nodeId, highlight) {
        lineGroup.find('Line').forEach(line => {
            if (line.attrs.from === nodeId || line.attrs.to === nodeId) {
                line.stroke(highlight ? 'rgba(255, 215, 0, 0.8)' : 'rgba(100, 100, 150, 0.5)'); // Gold highlight
                line.strokeWidth(highlight ? 3 : 2);
                line.dash(highlight ? [] : [5, 5]); // Solid line when highlighted
            }
        });
    }

    // --- Create all nodes and connections ---
    Object.keys(mathUniverseData).forEach(subjectKey => {
        const subjectData = mathUniverseData[subjectKey];
        const concepts = subjectData.concepts;
        const palette = subjectData.colorPalette;

        Object.values(concepts).forEach(concept => {
            createConceptNode(concept, subjectKey, palette);
        });
    });

    Object.keys(mathUniverseData).forEach(subjectKey => {
        const concepts = mathUniverseData[subjectKey].concepts;
        Object.values(concepts).forEach(concept => {
            const fromNodeId = `${subjectKey}.${concept.id}`;
            if (concept.connections && konvaNodes[fromNodeId]) {
                concept.connections.forEach(targetFullId => {
                    if (targetFullId.includes('.') && konvaNodes[targetFullId]) {
                        createConnectionLine(konvaNodes[fromNodeId], konvaNodes[targetFullId]);
                    }
                });
            }
        });
    });

    layer.draw(); // Initial draw of the layer

    // --- NEW Subject Navigation ---
    function createSubjectNavigation() {
        if (!subjectNavigationContainer) return;
        subjectNavigationContainer.innerHTML = '';
        Object.keys(mathUniverseData).forEach(subjectKey => {
            const subjectData = mathUniverseData[subjectKey];
            const button = document.createElement('button');
            button.textContent = subjectData.name;
            button.dataset.subject = subjectKey;
            button.classList.add('subject-nav-button');

            button.addEventListener('click', () => {
                const center = subjectData.center || { x: stage.width() / 2, y: stage.height() / 2 };
                const targetScale = 0.8;

                const newStagePos = {
                    x: stage.width() / 2 - center.x * targetScale,
                    y: stage.height() / 2 - center.y * targetScale,
                };

                const tween = new Konva.Tween({
                    node: stage,
                    duration: 0.6,
                    x: newStagePos.x,
                    y: newStagePos.y,
                    scaleX: targetScale,
                    scaleY: targetScale,
                    easing: Konva.Easings.EaseInOut,
                });
                tween.play();
            });
            subjectNavigationContainer.appendChild(button);
        });
    }
    createSubjectNavigation();

    // --- MODIFIED Overlay Logic ---
    function populateOverlay(concept, subjectKey) {
        conceptTitleEl.textContent = concept.title;
        myTakeEl.textContent = concept.content.myTake || 'Explanation coming soon!';
        formalContentEl.innerHTML = concept.content.formal || '<p>No formal definition provided yet.</p>';

        const currentFullId = `${subjectKey}.${concept.id}`;

        connectionsListEl.innerHTML = '';
        if (concept.connections && concept.connections.length > 0) {
            concept.connections.forEach(connFullId => {
                const targetNode = konvaNodes[connFullId];
                if (targetNode) {
                    const [targetSubjectKey, targetConceptId] = connFullId.split('.');
                    const targetConcept = mathUniverseData[targetSubjectKey]?.concepts[targetConceptId];
                    if (targetConcept) {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = `#${connFullId}`;
                        a.dataset.targetId = connFullId;
                        a.textContent = targetConcept.title;
                        if (targetNode.attrs.subject !== subjectKey) {
                            a.style.fontWeight = 'bold';
                            a.textContent += ` (${mathUniverseData[targetSubjectKey].name})`;
                        }

                        a.onclick = (e) => {
                            e.preventDefault();
                            zoomToNode(targetNode);
                            return false;
                        };
                        li.appendChild(a);
                        connectionsListEl.appendChild(li);
                    }
                }
            });
        } else {
            connectionsListEl.innerHTML = '<li>No direct connections listed.</li>';
        }

        resourcesListEl.innerHTML = '';
        if (concept.content.resources && concept.content.resources.length > 0) {
            concept.content.resources.forEach(res => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = res.url || '#';
                a.target = '_blank'; // Open external links in new tab
                a.rel = 'noopener noreferrer';

                // Add icon based on type
                let iconClass = 'fa-solid fa-link'; // Default
                if (res.type === 'video') iconClass = 'fa-solid fa-video';
                else if (res.type === 'article') iconClass = 'fa-solid fa-newspaper';
                else if (res.type === 'notes') iconClass = 'fa-solid fa-pen-to-square';
                else if (res.type === 'book') iconClass = 'fa-solid fa-book';
                else if (res.type === 'course') iconClass = 'fa-solid fa-graduation-cap';

                a.innerHTML = `<i class="${iconClass}"></i> ${res.text}`;
                li.appendChild(a);
                resourcesListEl.appendChild(li);
            });
        } else {
            resourcesListEl.innerHTML = '<li>No resources listed yet.</li>';
        }

        visualizationContainer.innerHTML = concept.content.visualization?.html || '<p>No visualization available.</p>';
        toolContainer.innerHTML = concept.content.tool?.html || '<p>No computational tool available.</p>';

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([overlay]).catch((err) => console.error('MathJax Typesetting Error:', err));
        }
    }

    closeOverlayBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
    });

    // Close overlay if clicked outside of it (optional)
    // document.addEventListener('click', (event) => {
    //     if (overlay.classList.contains('visible') && !overlay.contains(event.target) && event.target !== closeOverlayBtn) {
    //         // Ensure click wasn't on a canvas node either (more complex check needed)
    //         // overlay.classList.remove('visible');
    //     }
    // });

    // --- Zoom & Pan Control ---
    const scaleBy = 1.1; // Zoom factor
    stage.on('wheel', (e) => {
        e.evt.preventDefault(); // Prevent page scrolling
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // Zoom in/out based on wheel direction
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        // Limit zoom levels (optional)
        // newScale = Math.max(0.1, Math.min(newScale, 5));

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    });

    // Function to smoothly zoom/pan to a node
    function zoomToNode(node, targetScale = 1.0) { // targetScale can be adjusted
        const duration = 500; // Animation duration in ms

        const targetX = node.x();
        const targetY = node.y();

        // Calculate the required stage position to center the node
        const newStagePos = {
            x: stage.width() / 2 - targetX * targetScale,
            y: stage.height() / 2 - targetY * targetScale,
        };

        // Use Konva's tweening for smooth animation
        const tween = new Konva.Tween({
            node: stage,
            duration: duration / 1000, // Konva expects seconds
            x: newStagePos.x,
            y: newStagePos.y,
            scaleX: targetScale,
            scaleY: targetScale,
            easing: Konva.Easings.EaseInOut,
        });
        tween.play();
    }

    // --- Search Functionality ---
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;

        let foundNode = null;
        for (const subjectKey in mathUniverseData) {
            const concepts = mathUniverseData[subjectKey].concepts;
            for (const id in concepts) {
                if (concepts[id].title.toLowerCase().includes(searchTerm)) {
                    foundNode = konvaNodes[`${subjectKey}.${id}`];
                    break; // Find first match
                }
                // Optional: Search in 'myTake' content as well
                if (concepts[id].content.myTake?.toLowerCase().includes(searchTerm)) {
                    foundNode = konvaNodes[`${subjectKey}.${id}`];
                    break;
                }
            }
            if (foundNode) break;
        }

        if (foundNode) {
            zoomToNode(foundNode, 1.2); // Zoom in slightly on found node
            // Optional: Open the overlay for the found concept
            // populateOverlay(concepts[foundNode.id()]);
            // overlay.classList.add('visible');

            // Add a temporary visual cue (e.g., highlight)
            const circle = foundNode.findOne('Circle');
            if (circle) {
                const originalFill = circle.fill();
                circle.fill('yellow'); // Temp highlight
                foundNode.getLayer().batchDraw();
                setTimeout(() => {
                    circle.fill(originalFill);
                    foundNode.getLayer().batchDraw();
                }, 1500); // Remove highlight after 1.5s
            }
        } else {
            alert('Concept not found!'); // Simple feedback
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // --- Theme Switcher ---
    themeSwitcherBtn.addEventListener('click', () => {
        document.body.classList.remove(currentTheme);
        if (currentTheme === 'theme-blueprint') {
            currentTheme = 'theme-cosmic';
            // TODO: Update Konva node/line styles dynamically for cosmic theme if needed
        } else {
            currentTheme = 'theme-blueprint';
            // TODO: Update Konva node/line styles back to blueprint theme
        }
        document.body.classList.add(currentTheme);
        // Force redraw or style update if needed for canvas elements
        layer.batchDraw(); // May not be enough, might need explicit style updates
        console.log("Switched theme to:", currentTheme);
    });

    // --- Window Resize Handling ---
    window.addEventListener('resize', () => {
        stage.width(window.innerWidth);
        stage.height(window.innerHeight);
        stage.batchDraw();
    });

}); // End DOMContentLoaded