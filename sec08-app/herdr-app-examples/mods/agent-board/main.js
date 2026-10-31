import { View, div, svg, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { agents, run, theme } from "herdr";

// Three columns. Idle agents (already looked at) sit with Done.
const COLUMNS = [
  { key: "blocked", label: "Needs you", color: "blocked", match: (s) => s === "blocked" },
  { key: "working", label: "Working", color: "working", match: (s) => s === "working" },
  { key: "done", label: "Done", color: "done", match: (s) => s === "done" || s === "idle" },
];

export default class AgentBoard extends View {
  open(a) {
    run("space.select", { id: a.space });
    run("tab.select", { id: a.tab });
    run("agent.focus", { terminal: a.address });
  }

  card(a, col, t) {
    const p = a.program;
    return h_flex().id(`card-${a.address}`).gap(8).p(9).items_start().flex_none().rounded(8)
      .border(1).border_color(a.focused ? t.accent : t.border).bg(t.raised)
      .hover((s) => s.bg(t.hover))
      .on_click(() => this.open(a))
      .when(Boolean(p?.icon), (el) => el.child(p.tint ? svg(p.icon).size(16).flex_none().text_color(t.muted) : image(p.icon).size(16).flex_none()))
      .child(v_flex().flex_1().min_w(0).gap(2)
        .child(div().text_size(12.5).font_semibold().text_color(t.foreground).truncate().child(a.tab_name))
        .child(div().text_size(11).text_color(t.muted).truncate().child(a.space_name))
        .when(Boolean(a.title), (el) => el.child(div().text_size(11).text_color(t.dim).truncate().child(a.title))))
      .when(a.status === "idle", (el) => el.child(div().text_size(10).text_color(t.dim).flex_none().child("seen")))
      .when(a.status === "working", (el) => el.child(svg("mods/workspace-chrome/spinner.svg").size(12).flex_none().text_color(t[col.color]).spin(900)));
  }

  render() {
    const t = theme();
    const all = agents();
    return h_flex().size_full().gap(8).p(8).bg(t.canvas).children(COLUMNS.map((col) => {
      const list = all.filter((a) => col.match(a.status)).sort((x, y) => y.seq - x.seq);
      return v_flex().id(`col-${col.key}`).flex_1().min_w(0).h_full().gap(6).p(8).rounded(8).bg(t.chrome).border(1).border_color(t.border)
        .child(h_flex().gap(7).items_center().flex_none()
          .child(div().size(8).rounded(4).bg(t[col.color]))
          .child(div().text_size(12.5).font_semibold().text_color(t.foreground).child(col.label))
          .child(div().text_size(11).text_color(t.dim).child(String(list.length))))
        .child(v_flex().id(`list-${col.key}`).flex_1().min_h(0).gap(6).overflow_y_scrollbar()
          .children(list.map((a) => this.card(a, col, t)))
          .when(list.length === 0, (el) => el.child(div().text_size(11).text_color(t.dim).child("—"))));
    }));
  }
}
