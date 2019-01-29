export class GraphColoringGenerator {

    /** Generate all possible (including invalid) colorings.
     *  Note that the generated coloring array is re-used internally for speed -
     *  careful when saving a reference! Prefer a copy if you really need to.
     */
    public static* allColorings(num_nodes: number, num_colors: number): IterableIterator<number[]> {
        const total_possible_colorings = num_colors ** num_nodes;
        const radix = num_colors;

        // use an array as a radix-n counter, yield all countable values
        const colors: number[] = Array(num_nodes).fill(0);

        // define how to 'count' using the radix-n counter
        let max_reached = false;
        const increment = (idx: number) => {
            if (idx === colors.length) {
                max_reached = true;
                return;
            }
            colors[idx]++;
            if (colors[idx] === radix) {
                // next 'digit' ticks over
                colors[idx] = 0;
                increment(idx + 1);
            }
        }

        let colorings_tried = 0;
        while (true) {
            colorings_tried++;
            yield colors;
            increment(0);
            if (max_reached) {
                break;
            }
        }

        if (colorings_tried !== total_possible_colorings) {
            throw new Error('this was unexpected!');
        }
    }
}
